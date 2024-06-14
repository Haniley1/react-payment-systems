#!/bin/sh
set -e
echo "Update CA Certificates"
whoami
cp /tmp/certs/rootCA.pem /usr/local/share/ca-certificates/ca.crt
update-ca-certificates
echo "Update CA Certificates done"
echo "Start node"
echo $@
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

su -s /bin/sh node -c "exec $@"
