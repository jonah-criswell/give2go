class Api::V1::StudentsController < ApplicationController
  before_action :authenticate_student, only: [:profile]

  def profile
    render json: { 
      student: { 
        id: @current_student.id, 
        name: @current_student.name, 
        email: @current_student.email,
        university: @current_student.university,
        year: @current_student.year,
        balance: @current_student.balance,
        formatted_balance: @current_student.formatted_balance
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
