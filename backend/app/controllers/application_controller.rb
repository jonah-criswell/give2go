class ApplicationController < ActionController::API
  before_action :authenticate_student!

  private

  def authenticate_student!
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
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
