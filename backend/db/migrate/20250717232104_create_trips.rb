class CreateTrips < ActiveRecord::Migration[8.0]
  def change
    create_table :trips do |t|
      t.string :name
      t.string :location_country
      t.string :location_city
      t.decimal :goal_amount
      t.date :donation_deadline
      t.references :student, null: false, foreign_key: true

      t.timestamps
    end
  end
end
