class ApplicationController < ActionController::API
  before_action :authenticate_student!

  private

  def authenticate_student!
    header = request.headers['Authorization']
    return render json: { error: 'Authorization header missing' }, status: :unauthorized unless header
    
    token = header.split(' ').last
    return render json: { error: 'Invalid authorization format' }, status: :unauthorized unless token
    
    begin
      decoded = JwtService.decode(token)
      @current_student = Student.find(decoded['student_id'])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_student
    @current_student
  end
end
