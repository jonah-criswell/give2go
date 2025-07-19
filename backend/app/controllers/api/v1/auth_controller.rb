class Api::V1::AuthController < ApplicationController
  skip_before_action :authenticate_student!, only: [:register, :login]

  def register
    ActiveRecord::Base.transaction do
      student = Student.new(student_params)
      trip_id = params[:trip_id]
      unless trip_id.present?
        render json: { errors: ["Trip selection is required."] }, status: :unprocessable_entity and return
      end
      if student.save
        student_profile = StudentProfile.new(student: student, trip_id: trip_id)
        unless student_profile.save
          student.destroy # rollback student if profile fails
          render json: { errors: student_profile.errors.full_messages }, status: :unprocessable_entity and return
        end
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
            formatted_balance: student.formatted_balance,
            bio: student.bio,
            headline: student.headline,
            major: student.major,
            profile_picture_url: student.profile_picture.attached? ? rails_blob_url(student.profile_picture) : nil
          } 
        }, status: :created
      else
        render json: { errors: student.errors.full_messages }, status: :unprocessable_entity
      end
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
          formatted_balance: student.formatted_balance,
          bio: student.bio,
          headline: student.headline,
          major: student.major,
          profile_picture_url: student.profile_picture.attached? ? rails_blob_url(student.profile_picture) : nil
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
            formatted_balance: student.formatted_balance,
            bio: student.bio,
            headline: student.headline,
            major: student.major,
            profile_picture_url: student.profile_picture.attached? ? rails_blob_url(student.profile_picture) : nil
          } 
        }
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end

  def update_profile
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      begin
        payload = JwtService.decode(token)
        student = Student.find(payload['student_id'])
        
        if student.update(profile_params)
          render json: { 
            student: { 
              id: student.id, 
              name: student.name, 
              email: student.email,
              university: student.university,
              year: student.year,
              balance: student.balance,
              formatted_balance: student.formatted_balance,
              bio: student.bio,
              headline: student.headline,
              major: student.major,
              profile_picture_url: student.profile_picture.attached? ? rails_blob_url(student.profile_picture) : nil
            } 
          }
        else
          render json: { errors: student.errors.full_messages }, status: :unprocessable_entity
        end
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end

  private

  def student_params
    params.require(:student).permit(:name, :email, :password, :password_confirmation, :university, :year, :headline)
  end

  def profile_params
    params.require(:student).permit(:bio, :major, :profile_picture, :headline)
  end
end
