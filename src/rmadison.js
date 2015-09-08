import _ from 'prelude-ls';
import HTTPStatus from 'http-status';
import request from 'request';

export const getPackageInformation = (rmadisonUrl, pkg) => {
    return new Promise((resolve, reject) => {
        request.get({
            url: rmadisonUrl,
            qs: {
                package: pkg,
            },
        }, (error, rsp, body) => {
            if (error) return reject(error);

            if (rsp.statusCode !== HTTPStatus.OK) return reject(new Error(`Got ${rsp.statusCode}`));

            let res = _.foldl((res, line) => {
                let [pkg, version, suite, source] = _.map((x) => {
                    return x.trim();
                }, line.split('|'));

                if (version === undefined || suite === undefined) {
                    return res;
                }

                res.suite.unshift({
                    suite: suite,
                    version: version,
                });

                return res;
            }, {
                package: pkg,
                suite: [],
            }, body.split('\n'));

            return resolve(res);
        });
    });
};
