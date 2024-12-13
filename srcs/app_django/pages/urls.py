# pages/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from .views import *

urlpatterns = [
  # path('partial/<str:page>/', partial_content, name='partial_content'),

  path('profile/<str:username>/', profile, name='profile'),

  # navigation
  path("", starting_page, name="home"),
  path("home/", starting_page, name="home"),
  path("badGateway/", badGateway),
  path("menuPong/", menuPong),

  # account
	path('account/', include("account.urls")),

  # notification
	path('notification/', include("notification.urls")),

  # notifs
  path('send-notification/', send_notification, name='send_notification'),
  path('accept-friend-request/', accept_friend_request),

  # Game
  path("pong/<str:session_id>/", pong, name="pong_session"),
  path("pongIA/<str:session_id>/", pongIA, name="pong_session"),
  path("pong_local/<str:session_id>/", pongLocal, name="pong_session"),
  path("tournament/<str:tournament_id>/", tournament, name="tournament"),

]
