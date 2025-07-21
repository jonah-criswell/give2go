
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :universities, only: [:index]
      post '/register', to: 'auth#register'
      post '/login', to: 'auth#login'
      
      get '/student/profile', to: 'auth#profile'
      patch '/student/profile', to: 'auth#update_profile'
      get '/students', to: 'students#index'

      resources :donations, only: [:create, :index]
      resources :group_donations, only: [:create] do
        collection do
          get :preview
        end
      end
      
      resources :trips, only: [:index, :show, :create, :update, :destroy]
    end
  end
end

