class Api::V1::AuthController < ApplicationController

  def register
    student = Student.new(student_params)
    
    if student.save
      token = JwtService.encode({ student_id: student.id })
      render json: { 
        token: token, 
        student: { 
          id: student.id, 
          name: student.name, 
          email: student.email,
          university: student.university,
          year: student.year,
          balance: student.balance,
          formatted_balance: student.formatted_balance
        } 
      }, status: :created
    else
      render json: { errors: student.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    student = Student.find_by(email: params[:email])
    
    if student&.authenticate(params[:password])
      token = JwtService.encode({ student_id: student.id })
      render json: { 
        token: token, 
        student: { 
          id: student.id, 
          name: student.name, 
          email: student.email,
          university: student.university,
          year: student.year,
          balance: student.balance,
          formatted_balance: student.formatted_balance
        } 
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def profile
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      begin
        payload = JwtService.decode(token)
        student = Student.find(payload['student_id'])
        render json: { 
          student: { 
            id: student.id, 
            name: student.name, 
            email: student.email,
            university: student.university,
            year: student.year,
            balance: student.balance,
            formatted_balance: student.formatted_balance
          } 
        }
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end

  private

  def student_params
    params.require(:student).permit(:name, :email, :password, :password_confirmation, :university, :year)
  end
end
