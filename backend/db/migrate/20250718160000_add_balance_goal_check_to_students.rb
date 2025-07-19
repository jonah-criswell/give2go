class AddBalanceGoalCheckToStudents < ActiveRecord::Migration[7.0]
  def up
    if ActiveRecord::Base.connection.adapter_name.downcase.starts_with?('postgres')
      execute <<-SQL
        ALTER TABLE students
        ADD CONSTRAINT balance_not_above_goal
        CHECK (
          balance <= COALESCE(
            (SELECT goal_amount FROM trips
             WHERE trips.id = (SELECT trip_id FROM student_profiles WHERE student_profiles.student_id = students.id)
            ), 1000000000)
        );
      SQL
    else
      # NOTE: SQLite does not support cross-table check constraints.
      # This constraint should be added in production with PostgreSQL.
      say "Skipping balance_not_above_goal constraint: not supported on SQLite."
    end
  end

  def down
    if ActiveRecord::Base.connection.adapter_name.downcase.starts_with?('postgres')
      execute "ALTER TABLE students DROP CONSTRAINT IF EXISTS balance_not_above_goal;"
    end
  end
end 