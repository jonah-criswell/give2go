
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/register', to: 'auth#register'
      post '/login', to: 'auth#login'
      
      get '/student/profile', to: 'auth#profile'
      
      resources :trips, only: [:index, :show, :create, :update, :destroy]
    end
  end
end

