module Api
  module V1
    class GroupDonationsController < ApplicationController
      skip_before_action :authenticate_student!

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

          # Distribute the donation
          distribution_result = distribute_donation(eligible_students, total_amount)
          
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
        params.permit(:amount, :group_type, :university, :trip_name, :donor_name, :donor_email, :donor_phone, :note)
      end

      def get_eligible_students
        students = Student.includes(:trip, :university).all

        # Filter by group type
        case group_donation_params[:group_type]
        when 'university'
          if group_donation_params[:university].present?
            students = students.joins(:university).where(universities: { name: group_donation_params[:university] })
          end
        when 'trip'
          if group_donation_params[:trip_name].present?
            students = students.joins(student_profile: :trip).where(trips: { name: group_donation_params[:trip_name] })
          end
        when 'all'
          # No additional filtering needed
        end

        # Filter out students who have already reached their goal
        students.select do |student|
          next false unless student.trip&.goal_amount
          progress_percentage = (student.balance / student.trip.goal_amount) * 100
          progress_percentage < 100
        end
      end

      def calculate_max_distributable_amount(eligible_students)
        eligible_students.sum do |student|
          goal_amount = student.trip.goal_amount
          current_balance = student.balance
          max_can_receive = goal_amount - current_balance
          [max_can_receive, 0].max
        end
      end

      def distribute_donation(eligible_students, total_amount)
        distributions = []
        remaining_amount = total_amount

        # First pass: distribute evenly, but don't exceed any student's goal
        base_amount_per_student = total_amount / eligible_students.length
        
        eligible_students.each do |student|
          goal_amount = student.trip.goal_amount
          current_balance = student.balance
          max_can_receive = goal_amount - current_balance
          
          amount_for_student = [base_amount_per_student, max_can_receive].min
          
          distributions << {
            student: student,
            amount: amount_for_student,
            goal_amount: goal_amount,
            current_balance: current_balance,
            max_can_receive: max_can_receive
          }
          
          remaining_amount -= amount_for_student
        end

        # Second pass: redistribute excess funds to students who haven't reached their goal
        if remaining_amount > 0
          redistribute_excess(distributions, remaining_amount)
        end

        # Calculate average amount actually distributed
        total_distributed = distributions.sum { |d| d[:amount] }
        average_amount = total_distributed / distributions.length

        {
          distributions: distributions,
          average_amount: average_amount,
          total_distributed: total_distributed
        }
      end

      def redistribute_excess(distributions, excess_amount)
        # Get students who haven't reached their goal and can receive more
        eligible_for_redistribution = distributions.select do |d|
          d[:amount] < d[:max_can_receive]
        end

        return if eligible_for_redistribution.empty?

        # Distribute excess evenly among eligible students
        excess_per_student = excess_amount / eligible_for_redistribution.length
        
        # Track how much we actually distributed in this round
        distributed_this_round = 0
        
        eligible_for_redistribution.each do |distribution|
          additional_amount = [excess_per_student, distribution[:max_can_receive] - distribution[:amount]].min
          distribution[:amount] += additional_amount
          distributed_this_round += additional_amount
        end

        # If we couldn't distribute all the excess in this round, try again with remaining amount
        remaining_excess = excess_amount - distributed_this_round
        if remaining_excess > 0
          redistribute_excess(distributions, remaining_excess)
        end
      end
    end
  end
end 