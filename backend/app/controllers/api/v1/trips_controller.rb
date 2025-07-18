class Api::V1::TripsController < ApplicationController
  before_action :authenticate_student!, except: [:index, :show]

  def index
    trips = Trip.all
    render json: trips.map { |trip| trip_json(trip) }
  end

  def show
    trip = Trip.find(params[:id])
    render json: trip_json(trip)
  end

  def create
    # This endpoint is now for creating student profiles (linking students to trips)
    student_profile = current_student.build_student_profile(trip_id: params[:trip_id])
    
    if student_profile.save
      render json: { message: "Successfully joined trip", trip: trip_json(student_profile.trip) }, status: :created
    else
      render json: { errors: student_profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # This endpoint is now for updating student profile (changing trip)
    student_profile = current_student.student_profile
    
    if student_profile&.update(trip_id: params[:trip_id])
      render json: { message: "Successfully updated trip", trip: trip_json(student_profile.trip) }
    else
      render json: { errors: ["No trip profile found"] }, status: :unprocessable_entity
    end
  end

  def destroy
    # This endpoint is now for removing student from trip
    student_profile = current_student.student_profile
    
    if student_profile&.destroy
      render json: { message: "Successfully left trip" }
    else
      render json: { errors: ["No trip profile found"] }, status: :unprocessable_entity
    end
  end

  private

  def trip_params
    params.require(:trip).permit(:name, :location_country, :location_city, :goal_amount, :donation_deadline)
  end

  def trip_json(trip)
    {
      id: trip.id,
      name: trip.name,
      location_country: trip.location_country,
      location_city: trip.location_city,
      goal_amount: trip.goal_amount,
      donation_deadline: trip.donation_deadline,
      students_count: trip.students.count,
      created_at: trip.created_at,
      updated_at: trip.updated_at
    }
  end
end
