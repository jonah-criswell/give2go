# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_17_233828) do
  create_table "student_profiles", force: :cascade do |t|
    t.integer "student_id", null: false
    t.integer "trip_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["student_id"], name: "index_student_profiles_on_student_id"
    t.index ["trip_id"], name: "index_student_profiles_on_trip_id"
  end

  create_table "students", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "university"
    t.string "year"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "balance", precision: 10, scale: 2, default: "0.0"
    t.index ["email"], name: "index_students_on_email", unique: true
  end

  create_table "trips", force: :cascade do |t|
    t.string "name"
    t.string "location_country"
    t.string "location_city"
    t.decimal "goal_amount"
    t.date "donation_deadline"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "student_profiles", "students"
  add_foreign_key "student_profiles", "trips"
end
