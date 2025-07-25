require "open-uri"

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Add some common universities
universities = [
  { name: 'University of Georgia', abbreviation: 'UGA' },
  { name: 'Georgia Institute of Technology', abbreviation: 'Georgia Tech' },
  { name: 'Emory University', abbreviation: 'Emory' },
  { name: 'Georgia State University', abbreviation: 'GSU' },
  { name: 'Kennesaw State University', abbreviation: 'KSU' },
  { name: 'University of North Georgia', abbreviation: 'UNG' },
  { name: 'Georgia Southern University', abbreviation: 'GSU' },
  { name: 'University of West Georgia', abbreviation: 'UWG' },
  { name: 'Valdosta State University', abbreviation: 'VSU' },
  { name: 'Augusta University', abbreviation: 'AU' },
  { name: 'University of Texas at Austin', abbreviation: 'UT Austin' },
  { name: 'Texas A&M University', abbreviation: 'TAMU' },
  { name: 'Texas State University', abbreviation: 'TXST' },
  { name: 'University of Houston', abbreviation: 'UH' },
  { name: 'Rice University', abbreviation: 'Rice' },
  { name: 'Baylor University', abbreviation: 'Baylor' },
  { name: 'Texas Tech University', abbreviation: 'TTU' },
  { name: 'University of North Texas', abbreviation: 'UNT' },
  { name: 'University of Texas at Dallas', abbreviation: 'UT Dallas' },
  { name: 'University of Texas at Arlington', abbreviation: 'UT Arlington' },
  { name: 'University of Texas at San Antonio', abbreviation: 'UTSA' },
  { name: 'University of Texas at El Paso', abbreviation: 'UTEP' },
  { name: 'University of Texas at Brownsville', abbreviation: 'UTB' },
  { name: 'University of Texas at Tyler', abbreviation: 'UT Tyler' },
  { name: 'University of Texas at Permian Basin', abbreviation: 'UTPB' },
  { name: 'University of Texas at Rio Grande Valley', abbreviation: 'UTRGV' }
]

universities.each do |university_data|
  University.find_or_create_by(name: university_data[:name]) do |university|
    university.abbreviation = university_data[:abbreviation]
  end
end

puts "Seeded #{universities.length} universities"

# Create trips
trips = [
  {
    name: 'Kenya Mission Trip',
    location_country: 'Kenya',
    location_city: 'Nairobi',
    goal_amount: 4200,
    donation_deadline: Date.current + 3.months
  },
  {
    name: 'Costa Rica Service Project',
    location_country: 'Costa Rica',
    location_city: 'San José',
    goal_amount: 5100,
    donation_deadline: Date.current + 4.months
  },
  {
    name: 'Guatemala Community Outreach',
    location_country: 'Guatemala',
    location_city: 'Antigua',
    goal_amount: 3800,
    donation_deadline: Date.current + 2.months
  },
  {
    name: 'Mexico Border Ministry',
    location_country: 'Mexico',
    location_city: 'Tijuana',
    goal_amount: 3500,
    donation_deadline: Date.current + 5.months
  },
  {
    name: 'Dominican Republic Mission',
    location_country: 'Dominican Republic',
    location_city: 'Santo Domingo',
    goal_amount: 4500,
    donation_deadline: Date.current + 6.months
  }
]

trips.each do |trip_data|
  Trip.find_or_create_by(name: trip_data[:name]) do |trip|
    trip.location_country = trip_data[:location_country]
    trip.location_city = trip_data[:location_city]
    trip.goal_amount = trip_data[:goal_amount]
    trip.donation_deadline = trip_data[:donation_deadline]
  end
end

puts "Seeded #{trips.length} trips"

# Create students with varied fundraising progress
student_data = [
  # Students with low progress (0-25%)
  { name: 'Sarah Johnson', email: 'sarah.johnson@uga.edu', university: 'University of Georgia', trip: 'Kenya Mission Trip', balance: 500, year: '2nd', major: 'Psychology', headline: 'Passionate about mental health outreach', image_url: 'https://www.shutterstock.com/image-photo/smiling-female-student-backpack-books-600nw-2486906387.jpg' },
  { name: 'Michael Chen', email: 'michael.chen@gatech.edu', university: 'Georgia Institute of Technology', trip: 'Costa Rica Service Project', balance: 800, year: '3rd', major: 'Computer Science', headline: 'Using technology to serve communities', image_url: 'https://as2.ftcdn.net/jpg/01/81/30/23/1000_F_181302394_3EpTrADT6ybz8k6ldt8AZrKKeW0XBp95.jpg' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@emory.edu', university: 'Emory University', trip: 'Guatemala Community Outreach', balance: 300, year: '1st', major: 'Public Health', headline: 'Dedicated to improving global health', image_url: 'https://online.maryville.edu/wp-content/uploads/sites/97/2019/01/nutrition.jpg' },
  { name: 'David Kim', email: 'david.kim@gsu.edu', university: 'Georgia State University', trip: 'Mexico Border Ministry', balance: 600, year: '4th', major: 'Social Work', headline: 'Advocating for vulnerable populations', image_url: 'https://cwi.edu/sites/default/files/news_ct/image/study-strategies-banner.jpg' },
  { name: 'Jessica Williams', email: 'jessica.williams@ksu.edu', university: 'Kennesaw State University', trip: 'Dominican Republic Mission', balance: 400, year: '2nd', major: 'Education', headline: 'Empowering through education', image_url: 'https://younginvincibles.org/wp-content/uploads/2019/02/MarlenMillan.jpg' },
  
  # Students with medium progress (25-75%)
  { name: 'Alex Thompson', email: 'alex.thompson@ung.edu', university: 'University of North Georgia', trip: 'Kenya Mission Trip', balance: 1500, year: '3rd', major: 'International Affairs', headline: 'Building bridges across cultures', image_url: 'https://wp-media.petersons.com/blog/wp-content/uploads/2017/12/10124345/eyewear-facial-hair-man-888956.jpg' },
  { name: 'Maria Garcia', email: 'maria.garcia@georgiasouthern.edu', university: 'Georgia Southern University', trip: 'Costa Rica Service Project', balance: 2200, year: '2nd', major: 'Environmental Science', headline: 'Protecting our planet together', image_url: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { name: 'James Wilson', email: 'james.wilson@uwg.edu', university: 'University of West Georgia', trip: 'Guatemala Community Outreach', balance: 1800, year: '4th', major: 'Business Administration', headline: 'Business with a purpose', image_url: 'https://randomuser.me/api/portraits/men/8.jpg' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@valdosta.edu', university: 'Valdosta State University', trip: 'Mexico Border Ministry', balance: 1200, year: '1st', major: 'Criminal Justice', headline: 'Justice and compassion in action', image_url: 'v' },
  { name: 'Robert Martinez', email: 'robert.martinez@augusta.edu', university: 'Augusta University', trip: 'Dominican Republic Mission', balance: 2000, year: '3rd', major: 'Nursing', headline: 'Caring for communities in need', image_url: 'https://randomuser.me/api/portraits/men/10.jpg' },
  
  # Students with high progress (75-99%)
  { name: 'Chloe Foster', email: 'amanda.foster@utexas.edu', university: 'University of Texas at Austin', trip: 'Kenya Mission Trip', balance: 3500, year: '2nd', major: 'Anthropology', headline: 'Understanding cultures, building connections', image_url: 'https://www.shutterstock.com/image-photo/smiling-female-student-backpack-books-600nw-2486906387.jpg' },
  { name: 'Jenna Lee', email: 'christopher.lee@tamu.edu', university: 'Texas A&M University', trip: 'Costa Rica Service Project', balance: 4200, year: '4th', major: 'Engineering', headline: 'Engineering solutions for communities', image_url: 'https://www.shutterstock.com/image-photo/smiling-female-student-backpack-books-600nw-2486906387.jpg' },
  { name: 'Rachel Green', email: 'rachel.green@txstate.edu', university: 'Texas State University', trip: 'Guatemala Community Outreach', balance: 3200, year: '3rd', major: 'Communication', headline: 'Sharing stories that matter', image_url: 'https://www.shutterstock.com/image-photo/smiling-female-student-backpack-books-600nw-2486906387.jpg' },
  { name: 'Daniel Brown', email: 'daniel.brown@uh.edu', university: 'University of Houston', trip: 'Mexico Border Ministry', balance: 2800, year: '1st', major: 'Political Science', headline: 'Policy and compassion working together', image_url: 'https://t4.ftcdn.net/jpg/04/07/56/25/360_F_407562548_JxUfwmEJBDVpJ1ZquXOPvaYWhnQqwOW6.jpg' },
  { name: 'Nicole Taylor', email: 'nicole.taylor@rice.edu', university: 'Rice University', trip: 'Dominican Republic Mission', balance: 3800, year: '2nd', major: 'Economics', headline: 'Economic empowerment through service', image_url: 'https://www.shutterstock.com/image-photo/smiling-female-student-backpack-books-600nw-2486906387.jpg' },
  
  # Students at 100% (will appear at the end due to sorting)
  { name: 'Kevin Davis', email: 'kevin.davis@baylor.edu', university: 'Baylor University', trip: 'Kenya Mission Trip', balance: 4200, year: '4th', major: 'Theology', headline: 'Faith in action, love in service' },
  { name: 'Stephanie White', email: 'stephanie.white@ttu.edu', university: 'Texas Tech University', trip: 'Costa Rica Service Project', balance: 5100, year: '3rd', major: 'Biology', headline: 'Science serving humanity' },
  { name: 'Mark Johnson', email: 'mark.johnson@unt.edu', university: 'University of North Texas', trip: 'Guatemala Community Outreach', balance: 3800, year: '2nd', major: 'Music', headline: 'Harmony in service and song', image_url: 'https://www.usnews.com/cmsmedia/32/1e/a75c4aa245fa8e14ef8f78efe300/https-media-gettyimages-com-id-1439945611-photo-student-writing-in-notebook-while-sitting-with-tablet-pc-in-college-library.jpg' },
  { name: 'Laura Smith', email: 'laura.smith@utdallas.edu', university: 'University of Texas at Dallas', trip: 'Mexico Border Ministry', balance: 3500, year: '1st', major: 'Psychology', headline: 'Mental health for all communities' },
  { name: 'Brian Wilson', email: 'brian.wilson@uta.edu', university: 'University of Texas at Arlington', trip: 'Dominican Republic Mission', balance: 4500, year: '4th', major: 'Social Work', headline: 'Building stronger communities' },
  
  # Additional students for pagination demonstration
  { name: 'Ashley Moore', email: 'ashley.moore@utsa.edu', university: 'University of Texas at San Antonio', trip: 'Kenya Mission Trip', balance: 900, year: '2nd', major: 'Public Health', headline: 'Health equity for all', image_url: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { name: 'Ryan Clark', email: 'ryan.clark@utep.edu', university: 'University of Texas at El Paso', trip: 'Costa Rica Service Project', balance: 1600, year: '3rd', major: 'Environmental Science', headline: 'Sustainable solutions for tomorrow', image_url: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { name: 'Megan Lewis', email: 'megan.lewis@utb.edu', university: 'University of Texas at Brownsville', trip: 'Guatemala Community Outreach', balance: 700, year: '1st', major: 'Education', headline: 'Teaching with heart and purpose', image_url: 'https://randomuser.me/api/portraits/women/13.jpg' },
  { name: 'Jason Hall', email: 'jason.hall@uttyler.edu', university: 'University of Texas at Tyler', trip: 'Mexico Border Ministry', balance: 1100, year: '4th', major: 'Criminal Justice', headline: 'Justice and mercy in balance', image_url: 'https://randomuser.me/api/portraits/men/14.jpg' },
  { name: 'Katherine Young', email: 'katherine.young@utpb.edu', university: 'University of Texas at Permian Basin', trip: 'Dominican Republic Mission', balance: 1400, year: '2nd', major: 'Nursing', headline: 'Compassionate care across borders', image_url: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { name: 'Thomas Allen', email: 'thomas.allen@utrgv.edu', university: 'University of Texas at Rio Grande Valley', trip: 'Kenya Mission Trip', balance: 1900, year: '3rd', major: 'International Business', headline: 'Business for social impact', image_url: 'https://randomuser.me/api/portraits/men/16.jpg' }
]

student_data.each do |student_info|
  university = University.find_by(name: student_info[:university])
  trip = Trip.find_by(name: student_info[:trip])

  if university && trip
    student = Student.find_or_create_by(email: student_info[:email]) do |s|
      s.name = student_info[:name]
      s.university = university
      s.year = student_info[:year]
      s.major = student_info[:major]
      s.headline = student_info[:headline]
      s.balance = student_info[:balance]
      s.password = 'password123'
    end

    unless student.student_profile
      StudentProfile.create!(student: student, trip: trip)
    end

    # Attach profile picture from randomuser.me if not already attached
    if student_info[:image_url] && !student.profile_picture.attached?
      student.profile_picture.attach(
        io: URI.open(student_info[:image_url]),
        filename: File.basename(URI.parse(student_info[:image_url]).path)
      )
    end
  end
end

puts "Seeded #{student_data.length} students with images"
puts "Total students in database: #{Student.count}"
puts "Students will be paginated with 16 per page"
