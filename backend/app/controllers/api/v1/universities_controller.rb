class Api::V1::UniversitiesController < ApplicationController
  skip_before_action :authenticate_student!, only: [:index]
  
  def index
    universities = University.order(:name).map do |university|
      {
        id: university.id,
        name: university.name,
        abbreviation: university.abbreviation
      }
    end
    
    render json: universities
  end
end
