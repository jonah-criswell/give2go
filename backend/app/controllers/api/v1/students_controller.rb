class Api::V1::StudentsController < ApplicationController
  skip_before_action :authenticate_student!, only: [:index]
  before_action :authenticate_student, only: [:profile]

  def index
    # Check if random ordering is requested
    if params[:random] == 'true'
      # Get students ordered by progress (100% students last)
      ordered_students = Student.includes(:trip, :university).order_by_progress.to_a
      
      # Separate students at 100% from those below 100%
      students_at_100 = []
      students_below_100 = []
      
      ordered_students.each do |student|
        goal_amount = student.trip&.goal_amount || 0
        if goal_amount > 0 && student.balance >= goal_amount
          students_at_100 << student
        else
          students_below_100 << student
        end
      end
      
      # Shuffle only the students below 100%, keep 100% students at the end
      students = students_below_100.shuffle + students_at_100
    else
      students = Student.includes(:trip, :university).order_by_progress
    end
    
    students = students.map do |student|
      {
        id: student.id,
        name: student.name,
        email: student.email,
        university: student.university.name,
        year: student.year,
        balance: student.balance,
        formatted_balance: student.formatted_balance,
        bio: student.bio,
        headline: student.headline,
        major: student.major,
        profile_picture_url: student.profile_picture.attached? ? rails_blob_url(student.profile_picture) : nil,
        trip: student.trip ? {
          id: student.trip.id,
          name: student.trip.name,
          location_city: student.trip.location_city,
          location_country: student.trip.location_country,
          goal_amount: student.trip.goal_amount
        } : nil
      }
    end
    
    render json: students
  end

  def profile
    render json: { 
      student: { 
        id: @current_student.id, 
        name: @current_student.name, 
        email: @current_student.email,
        university: @current_student.university.name,
        year: @current_student.year,
        balance: @current_student.balance,
        formatted_balance: @current_student.formatted_balance,
        bio: @current_student.bio,
        major: @current_student.major,
        profile_picture_url: @current_student.profile_picture.attached? ? rails_blob_url(@current_student.profile_picture) : nil,
        trip: @current_student.trip ? {
          id: @current_student.trip.id,
          name: @current_student.trip.name,
          location_city: @current_student.trip.location_city,
          location_country: @current_student.trip.location_country,
          goal_amount: @current_student.trip.goal_amount
        } : nil
      } 
    }
  end

  private

  def authenticate_student
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      begin
        payload = JwtService.decode(token)
        @current_student = Student.find(payload['student_id'])
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end
end
