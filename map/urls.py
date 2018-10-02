from rest_framework import routers
from map.views import *
from django.urls import path

router = routers.SimpleRouter()

router.register(r'types', TypesViewSet, 'types')
router.register(r'objects', ObjectsViewSet, 'objects')

urlpatterns = router.urls
urlpatterns += [path('', index, name='index'), ]
urlpatterns += [path('openmap', open_map_view, name='openmap'), ]
