import { createLogger } from 'bunyan';
import { expect } from 'chai';
import { basename } from 'path';
import supertest, { Response } from 'supertest';

import { setupOrmApp } from '../../../main';
import { TApp } from '@offscale/routes-merger/interfaces';

const tapp_name = `test::${basename(__dirname)}`;
const logger = createLogger({ name: tapp_name });

describe('Root::routes', () => {
    let app: TApp;

    before(done => setupOrmApp(
        new Map(), { orms_in: undefined, logger }, { skip_start_app: true, app_name: tapp_name, logger },
        (err: Error, _app?: TApp) => {
            if (err != null) return done(err);
            app = _app as TApp;
            return done(void 0);
        })
    );

    describe('/', () =>
        it('should get version', done => {
                supertest(app)
                    .get('/')
                    .expect('Content-Type', /json/)
                    .end((err, res: Response) => {
                        if (err != null) return done(err);
                        try {
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.an.instanceOf(Object);
                            expect(res.body).to.have.property('version');
                            expect(res.body.version.split('.').length - 1).to.be.equal(2);
                        } catch (e) {
                            err = e as Chai.AssertionError;
                        } finally {
                            done(err);
                        }
                    });
            }
        )
    );
});
