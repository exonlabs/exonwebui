#!/bin/bash
cd $(dirname $(readlink -f $0))/..


for PYTHON in `cat PYTHON |xargs` ;do
    echo -e "\n* Setup dev virtualenv for $PYTHON"

    SETUPENV_PATH=../venv_$PYTHON
    which $PYTHON >> /dev/null || { echo -e "\n-- Failed!! $PYTHON doesn't exist.\n"; exit 1; }

    echo -e "\n- creating virtualenv ..."
    $PYTHON -m virtualenv ${SETUPENV_PATH}
    [ -f ${SETUPENV_PATH}/bin/activate ] || { echo -e "\n-- Error!! failed to create virtualenv.\n"; exit 1; }

    . ${SETUPENV_PATH}/bin/activate
    [ -z "${VIRTUAL_ENV}" ] && { echo -e "\n-- Error!! failed to activate virtualenv.\n"; exit 1; }
    echo -e "\n- updating virtualenv packages ..."
    pip install -U pip setuptools wheel
    echo -e "\n- installing dev requirements ..."
    pip install -Ur dev_requirements.txt
    # fix till release flask-seasurf>=0.2.3 on pypi
    python -c 'import flask_seasurf as m; print(m.__version__>="0.2.3")' |grep -iq 'true' || \
        pip install -U git+git://github.com/maxcountryman/flask-seasurf.git@0.2.3#egg=flask_seasurf
    echo -e "\n- installing in develop mode ..."
    pip install -e ./
    deactivate
done

echo -e "\n* Done\n"
