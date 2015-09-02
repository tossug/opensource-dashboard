import chai from 'chai';
import HTTPStatus from 'http-status';
import nock from 'nock';

import {
    getPackageInformation,
} from '../src/debian';

const assert = chai.assert;

describe('Debian', () => {
    describe('getPackageInformation', () => {
        it('shall get package information', (done) => {
            let scope = nock('https://sources.debian.net')
                .get('/api/src/libchewing/')
                .reply(HTTPStatus.OK, {
                    "suite": "",
                    "versions": [
                    {
                        "suites": [
                            "stretch",
                            "sid"
                        ],
                        "version": "0.4.0-3",
                        "area": "main"
                    },
                    {
                        "suites": [
                            "jessie"
                        ],
                        "version": "0.4.0-2",
                        "area": "main"
                    },
                    {
                        "suites": [
                            "wheezy"
                        ],
                        "version": "0.3.3-4",
                        "area": "main"
                    },
                    {
                        "suites": [
                            "squeeze"
                        ],
                        "version": "0.3.2-2",
                        "area": "main"
                    },
                    {
                        "suites": [
                            "etch",
                            "lenny"
                        ],
                        "version": "0.3.0-1",
                        "area": "main"
                    },
                    {
                        "suites": [
                            "sarge"
                        ],
                        "version": "0.2.6+svn20050326-1",
                        "area": "main"
                    }
                    ],
                    "path": "libchewing",
                    "package": "libchewing",
                    "type": "package",
                    "pathl": [
                        [
                            "libchewing",
                            "/src/libchewing/"
                        ]
                    ]
                });

            getPackageInformation('libchewing')
            .then((info) => {
                assert.deepEqual(info, {
                    package: 'libchewing',
                    suites: {
                        sid: {
                            version: '0.4.0-3',
                        },
                        stretch: {
                            version: '0.4.0-3',
                        },
                        jessie: {
                            version: '0.4.0-2',
                        },
                        wheezy: {
                            version: '0.3.3-4',
                        },
                        squeeze: {
                            version: '0.3.2-2',
                        },
                        etch: {
                            version: '0.3.0-1',
                        },
                        lenny: {
                            version: '0.3.0-1',
                        },
                        sarge: {
                            version: '0.2.6+svn20050326-1',
                        },
                    },
                });
            }).then(done, done);
        });
    });
});
