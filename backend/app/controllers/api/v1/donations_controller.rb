module Api
  module V1
    class DonationsController < ApplicationController
      skip_before_action :authenticate_student!
      # POST /api/v1/donations
      def create
        Donation.transaction do
          student = Student.lock.find(donation_params[:student_id])
          trip = student.trip
          goal = trip&.goal_amount&.to_f
          bal = student.balance.to_f
          amt = donation_params[:amount].to_f
          if goal && bal + amt > goal
            render json: { errors: ["Donation would exceed the student's fundraising goal"] }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
          donation = Donation.new(donation_params)
          if donation.save
            render json: { donation: donation_response(donation) }, status: :created
          else
            render json: { errors: donation.errors.full_messages }, status: :unprocessable_entity
          end
        end
      end

      # GET /api/v1/donations?student_id=1
      def index
        if params[:student_id]
          donations = Donation.where(student_id: params[:student_id]).order(created_at: :desc)
        else
          donations = Donation.all.order(created_at: :desc)
        end
        render json: donations.map { |d| donation_response(d) }
      end

      private

      def donation_params
        params.require(:donation).permit(:amount, :name, :email, :phone, :note, :student_id)
      end

      def donation_response(donation)
        {
          id: donation.id,
          amount: donation.amount,
          name: donation.name.presence || 'Anonymous',
          email: donation.email,
          phone: donation.phone,
          note: donation.note,
          student_id: donation.student_id,
          created_at: donation.created_at
        }
      end
    end
  end
end
