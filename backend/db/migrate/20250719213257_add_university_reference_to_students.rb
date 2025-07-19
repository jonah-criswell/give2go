class AddUniversityReferenceToStudents < ActiveRecord::Migration[8.0]
  def up
    # Add university_id column to students (nullable initially)
    add_reference :students, :university, null: true, foreign_key: true
    
    # Migrate existing university data
    # Create universities from existing student data
    execute <<-SQL
      INSERT INTO universities (name, abbreviation, created_at, updated_at)
      SELECT DISTINCT university, 
             CASE 
               WHEN university LIKE '%University of Georgia%' THEN 'UGA'
               WHEN university LIKE '%Georgia Tech%' THEN 'GT'
               WHEN university LIKE '%Emory%' THEN 'Emory'
               WHEN university LIKE '%Georgia State%' THEN 'GSU'
               WHEN university LIKE '%Kennesaw State%' THEN 'KSU'
               WHEN university LIKE '%University of North Georgia%' THEN 'UNG'
               WHEN university LIKE '%Georgia Southern%' THEN 'GSU'
               WHEN university LIKE '%University of West Georgia%' THEN 'UWG'
               WHEN university LIKE '%Valdosta State%' THEN 'VSU'
               WHEN university LIKE '%Augusta University%' THEN 'AU'
               WHEN university LIKE '%University of Texas%' THEN 'UT'
               WHEN university LIKE '%Texas A%' THEN 'TAMU'
               WHEN university LIKE '%Texas State%' THEN 'TXST'
               WHEN university LIKE '%University of Houston%' THEN 'UH'
               WHEN university LIKE '%Rice%' THEN 'Rice'
               WHEN university LIKE '%Baylor%' THEN 'Baylor'
               WHEN university LIKE '%Texas Tech%' THEN 'TTU'
               WHEN university LIKE '%University of North Texas%' THEN 'UNT'
               WHEN university LIKE '%University of Texas at Austin%' THEN 'UT Austin'
               WHEN university LIKE '%University of Texas at Dallas%' THEN 'UT Dallas'
               WHEN university LIKE '%University of Texas at Arlington%' THEN 'UT Arlington'
               WHEN university LIKE '%University of Texas at San Antonio%' THEN 'UTSA'
               WHEN university LIKE '%University of Texas at El Paso%' THEN 'UTEP'
               WHEN university LIKE '%University of Texas at Brownsville%' THEN 'UTB'
               WHEN university LIKE '%University of Texas at Tyler%' THEN 'UT Tyler'
               WHEN university LIKE '%University of Texas at Permian Basin%' THEN 'UTPB'
               WHEN university LIKE '%University of Texas at Rio Grande Valley%' THEN 'UTRGV'
               ELSE university
             END,
             datetime('now'), datetime('now')
      FROM students 
      WHERE university IS NOT NULL AND university != ''
    SQL
    
    # Update students to reference the new universities
    execute <<-SQL
      UPDATE students 
      SET university_id = (
        SELECT id FROM universities WHERE universities.name = students.university
      )
      WHERE university IS NOT NULL AND university != ''
    SQL
    
    # Make university_id non-nullable
    change_column_null :students, :university_id, false
    
    # Remove the old university column
    remove_column :students, :university
  end
  
  def down
    # Add back the university column
    add_column :students, :university, :string
    
    # Migrate data back
    execute <<-SQL
      UPDATE students 
      SET university = (
        SELECT name FROM universities WHERE universities.id = students.university_id
      )
    SQL
    
    # Remove the foreign key and university_id column
    remove_reference :students, :university
  end
end
