module Api
  module V1
    class GroupDonationsController < ApplicationController
      skip_before_action :authenticate_student!

      # GET /api/v1/group_donations/preview
      def preview
        # Cache key based on group parameters (excluding amount and bias_factor)
        cache_key = "eligible_students_#{preview_params[:group_type]}_#{preview_params[:university]}_#{preview_params[:trip_name]}"
        
        # Use Rails.cache to avoid recalculating eligible students for same group
        eligible_students = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
          get_eligible_students
        end
        
        if eligible_students.empty?
          render json: { error: "No eligible students found for the specified criteria" }, status: :unprocessable_entity
          return
        end

        total_amount = preview_params[:amount].to_f
        if total_amount <= 0
          render json: { error: "Invalid donation amount" }, status: :unprocessable_entity
          return
        end

        # Calculate maximum distributable amount (cached with eligible students)
        max_distributable = Rails.cache.fetch("#{cache_key}_max_distributable", expires_in: 5.minutes) do
          calculate_max_distributable_amount(eligible_students)
        end
        
        if total_amount > max_distributable
          render json: { 
            error: "Donation amount exceeds maximum distributable amount",
            max_distributable_amount: max_distributable,
            requested_amount: total_amount
          }, status: :unprocessable_entity
          return
        end

        # Get bias factor (if not provided, use original equal distribution algorithm)
        bias_factor = preview_params[:bias_factor]&.to_f
        
        # Calculate preview distribution
        distribution_result = distribute_donation(eligible_students, total_amount, bias_factor)
        
        render json: {
          distributions: distribution_result[:distributions].map { |d| {
            student_id: d[:student].id,
            student_name: d[:student].name,
            amount: d[:amount],
            goal_amount: d[:goal_amount],
            current_balance: d[:current_balance],
            max_can_receive: d[:max_can_receive]
          }},
          total_distributed: distribution_result[:total_distributed],
          average_amount: distribution_result[:average_amount],
          max_distributable_amount: max_distributable
        }, status: :ok
      end

      # POST /api/v1/group_donations
      def create
        ActiveRecord::Base.transaction do
          # Get eligible students based on group criteria
          eligible_students = get_eligible_students
          
          if eligible_students.empty?
            render json: { error: "No eligible students found for the specified criteria" }, status: :unprocessable_entity
            return
          end

          total_amount = group_donation_params[:amount].to_f
          if total_amount <= 0
            render json: { error: "Invalid donation amount" }, status: :unprocessable_entity
            return
          end

          # Calculate maximum distributable amount
          max_distributable = calculate_max_distributable_amount(eligible_students)
          if total_amount > max_distributable
            render json: { 
              error: "Donation amount exceeds maximum distributable amount",
              max_distributable_amount: max_distributable,
              requested_amount: total_amount
            }, status: :unprocessable_entity
            return
          end

          # Get bias factor (if not provided, use original equal distribution algorithm)
          bias_factor = group_donation_params[:bias_factor]&.to_f
          
          # Distribute the donation
          distribution_result = distribute_donation(eligible_students, total_amount, bias_factor)
          
          # Create individual donations for each student
          donations_created = []
          distribution_result[:distributions].each do |dist|
            next if dist[:amount] <= 0
            
            donation = Donation.new(
              amount: dist[:amount],
              name: group_donation_params[:donor_name],
              email: group_donation_params[:donor_email],
              phone: group_donation_params[:donor_phone],
              note: group_donation_params[:note],
              student_id: dist[:student].id
            )
            
            if donation.save
              donations_created << donation
            else
              render json: { error: "Failed to create donation for student #{dist[:student].name}" }, status: :unprocessable_entity
              raise ActiveRecord::Rollback
            end
          end

          render json: {
            success: true,
            total_amount: total_amount,
            student_count: donations_created.length,
            average_amount_per_student: distribution_result[:average_amount],
            distributions: distribution_result[:distributions].map { |d| {
              student_name: d[:student].name,
              amount: d[:amount],
              student_id: d[:student].id
            }}
          }, status: :created
        end
      rescue => e
        Rails.logger.error "Group donation error: #{e.message}"
        render json: { error: "Failed to process group donation" }, status: :internal_server_error
      end

      private

      def group_donation_params
        params.permit(:amount, :group_type, :university, :trip_name, :donor_name, :donor_email, :donor_phone, :note, :bias_factor)
      end

      def preview_params
        params.permit(:amount, :group_type, :university, :trip_name, :bias_factor)
      end

      def get_eligible_students
        # Build the base query with proper includes to avoid N+1 queries
        base_query = Student.includes(:trip, :university, :student_profile)

        # Apply group type filtering
        case group_donation_params[:group_type]
        when 'university'
          if group_donation_params[:university].present?
            base_query = base_query.joins(:university).where(universities: { name: group_donation_params[:university] })
          end
        when 'trip'
          if group_donation_params[:trip_name].present?
            base_query = base_query.joins(student_profile: :trip).where(trips: { name: group_donation_params[:trip_name] })
          end
        when 'all'
          # No additional filtering needed
        end

        # Filter out students who have already reached their goal
        # Use a separate query to avoid mixing includes with complex joins
        eligible_student_ids = base_query.joins(:trip)
          .where('students.balance < trips.goal_amount AND trips.goal_amount IS NOT NULL')
          .pluck(:id)

        # Now load the full objects with all associations preloaded
        # Use eager loading to ensure all associations are loaded in a single query
        result = Student.includes(:trip, :university, :student_profile)
          .where(id: eligible_student_ids)
          .to_a

        # Verify associations are loaded to prevent N+1 queries
        result.each do |student|
          # Force load associations if they're not already loaded
          student.trip unless student.association(:trip).loaded?
          student.university unless student.association(:university).loaded?
          student.student_profile unless student.association(:student_profile).loaded?
        end

        result
      end

      def calculate_max_distributable_amount(eligible_students)
        # Calculate sum of max distributable amounts for each student
        # Associations are preloaded, so this should be fast
        eligible_students.sum do |student|
          goal_amount = student.trip&.goal_amount || 0
          current_balance = student.balance
          max_can_receive = goal_amount - current_balance
          [max_can_receive, 0].max
        end
      end

      def distribute_donation(eligible_students, total_amount, bias_factor = nil)
        return { distributions: [], average_amount: 0, total_distributed: 0 } if eligible_students.empty?

        # Pre-calculate student data to avoid repeated calculations
        student_data = eligible_students.map do |student|
          goal_amount = student.trip&.goal_amount || 5000
          current_balance = student.balance
          max_can_receive = [goal_amount - current_balance, 0].max
          need = [goal_amount - current_balance, 0].max
          {
            student: student,
            goal_amount: goal_amount,
            current_balance: current_balance,
            max_can_receive: max_can_receive,
            need: need
          }
        end

        needs = student_data.map { |data| data[:need] }
        total_need = needs.sum
        n = eligible_students.length
        # Always use distribute_with_bias, defaulting to 0.0 for equal distribution
        allocations = distribute_with_bias(total_amount, needs, bias_factor || 0.0, total_need, n)

        distributions = student_data.each_with_index.map do |data, i|
          {
            student: data[:student],
            amount: allocations[i],
            goal_amount: data[:goal_amount],
            current_balance: data[:current_balance],
            max_can_receive: data[:max_can_receive]
          }
        end

        total_distributed = distributions.sum { |d| d[:amount] }
        average_amount = total_distributed / distributions.length

        {
          distributions: distributions,
          average_amount: average_amount,
          total_distributed: total_distributed
        }
      end

      def distribute_with_bias(amount_left, needs, bias_factor, total_need, n, excluded = Set.new)
        # Calculate weights for students not excluded
        weights = needs.map.with_index do |need, i|
          next 0 if excluded.include?(i) || need <= 0
          
          equal = 1.0 / (n - excluded.size)
          proportional = total_need > 0 ? need / total_need : equal
          (1 - bias_factor) * equal + bias_factor * proportional
        end
        
        total_weight = weights.sum
        return Array.new(n, 0) if total_weight == 0
        
        # Initial allocation
        allocation = weights.map { |w| (w / total_weight) * amount_left }
        
        # Cap at need and collect excess
        excess = 0
        capped = false
        result = Array.new(n, 0)
        
        allocation.each_with_index do |alloc, i|
          next if excluded.include?(i) || needs[i] <= 0
          
          if alloc > needs[i]
            excess += alloc - needs[i]
            allocation[i] = needs[i]
            capped = true
          end
          result[i] = allocation[i]
        end
        
        # Redistribute excess if needed
        if capped && excess > 0.0001
          new_needs = needs.map.with_index do |need, i|
            if excluded.include?(i) || allocation[i] >= need
              0
            else
              need - allocation[i]
            end
          end
          
          new_excluded = excluded.dup
          allocation.each_with_index do |alloc, i|
            new_excluded.add(i) if alloc >= needs[i]
          end
          
          recursive = distribute_with_bias(excess, new_needs, bias_factor, total_need, n, new_excluded)
          result.each_with_index { |val, i| result[i] = val + recursive[i] }
        end
        
        result
      end


    end
  end
end 