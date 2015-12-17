from __future__ import absolute_import, unicode_literals, division, print_function

__author__ = 'reyrodrigues'


from django.db import models
from django.utils.translation import ugettext as _
from django.conf import settings
from colorfield.fields import ColorField

class ColorSetting(models.Model):
    color = ColorField(default="#FFFFFF", blank=False, null=True)
    current_order = models.PositiveIntegerField(default=0)