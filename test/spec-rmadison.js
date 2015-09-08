import chai from 'chai';
import HTTPStatus from 'http-status';
import nock from 'nock';

import {
    getPackageInformation,
} from '../src/rmadison';

const assert = chai.assert;

describe('rmadison', () => {
    describe('getPackageInformation', () => {
        const host = 'https://api.ftp-master.debian.org';
        const path = 'rmadison';

        it('shall get package information', (done) => {
            let scope = nock(host)
                .get(`/${path}?package=libchewing`)
                .reply(HTTPStatus.OK,
                    "libchewing | 0.3.3-4       | oldstable       | source\n" +
                    "libchewing | 0.4.0-2       | stable          | source\n" +
                    "libchewing | 0.4.0-2       | stable-kfreebsd | source\n" +
                    "libchewing | 0.4.0-3       | testing         | source\n" +
                    "libchewing | 0.4.0-3       | unstable        | source\n"
                );

            getPackageInformation(`${host}/${path}`, 'libchewing')
            .then(res => {
                assert.deepEqual(res, {
                    package: 'libchewing',
                    suites: [
                        { suite: 'unstable', version: '0.4.0-3'},
                        { suite: 'testing', version: '0.4.0-3'},
                        { suite: 'stable-kfreebsd', version: '0.4.0-2'},
                        { suite: 'stable', version: '0.4.0-2'},
                        { suite: 'oldstable', version: '0.3.3-4'},
                    ],
                });
            }).then(done, done);
        });
    });
});
