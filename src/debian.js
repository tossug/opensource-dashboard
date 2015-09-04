import _ from 'prelude-ls';
import HTTPStatus from 'http-status';
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

                const ret = _.foldl((res, x) => {
                    res.suites[x.suite] = {
                        version: x.version,
                    };
                    return res;
                }, {
                    package: body.package,
                    suites: {},
                }, _.concatMap((version) => {
                    return _.map((suite) => {
                        return {
                            suite: suite,
                            version: version.version,
                        };
                    }, version.suites);
                }, body.versions));

                return resolve(ret);
            } catch (e) {
                return reject(e);
            }
        });
    });
};
