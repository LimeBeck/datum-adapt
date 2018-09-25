from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from rest_framework.authtoken.models import Token

from pollsapi import views


class TestPoll(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.view = views.PollViewSet.as_view({'get': 'list'})
        self.uri = '/polls/'
        self.user = self.setup_user()

    @staticmethod
    def setup_user():
        User = get_user_model()
        user = User.objects.create_user('test',
                                        email='test@user.com',
                                        password='test'
                                        )
        Token.objects.create(user=user)
        return user

    def test_list(self):
        request = self.factory.get(self.uri)
        request.user = self.user
        response = self.view(request)
        self.assertEqual(response.status_code, 200,
                         'Expected Response code 200, received {0} instead.'.format(response.status_code))

    def test_list2(self):
        self.client.login(username="test", password="test")
        response = self.client.get(self.uri)
        self.assertEqual(response.status_code, 200,
                         'Expected Response code 200, received {0} instead.'.format(response.status_code))

