from __future__ import absolute_import, unicode_literals, division, print_function

__author__ = 'reyrodrigues'

from . import views
from django.conf.urls import url, include

urlpatterns = [
    url(r'^', views.index)
]