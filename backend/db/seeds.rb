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
