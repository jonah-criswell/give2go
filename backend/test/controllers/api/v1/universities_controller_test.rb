require "test_helper"

class Api::V1::UniversitiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_universities_index_url
    assert_response :success
  end
end
