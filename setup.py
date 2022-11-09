# -*- coding: utf-8 -*-
from setuptools import setup

setup(
    name="exonwebui",
    install_requires=[
        'exonutils>=6.3,<7.0',
        'flask>=2.2',
        'Jinja2>=3.1',
        'Babel>=2.10',
        'flask-babelex>=0.9',
    ],
)
