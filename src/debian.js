import HTTPStatus from 'http-status';
import Immutable from 'immutable';
import request from 'request';

export const getPackageInformation = (pkg) => {
    return new Promise((resolve, reject) => {
        request.get({
            url:`https://sources.debian.net/api/src/${pkg}/`
        }, (error, rsp, body) => {
            if (error) {
                return reject(error);
            }

            if (rsp.statusCode !== HTTPStatus.OK) {
                return reject(new Error(`Got ${rsp.statusCode}`));
            }

            try {
                body = JSON.parse(body);

                const ret = Immutable.fromJS(body)
                    .get('versions')
                    .flatMap((version) => {
                        return version.get('suites').map((suite) => {
                            return Immutable.fromJS({
                                suite: suite,
                                version: version.get('version'),
                            });
                        });
                    })
                    .reduce((r, t) => {
                        r.suites[t.get('suite')] = {
                            version: t.get('version'),
                        };

                        return r;
                    }, {
                        package: body.package,
                        suites: {},
                    });

                return resolve(ret);
            } catch (e) {
                return reject(e);
            }
        });
    });
};
