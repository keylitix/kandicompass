import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Spinner from '../../../components/bootstrap/Spinner';

const LoadingWrapper = () => {
    return (
        <PageWrapper title={"Loading..."}>
            <Page className="d-flex justify-content-center align-items-center w-100 h-100">
                <div className='row d-flex align-items-center h-100'>
                    <div className='col-12 d-flex flex-column justify-content-center align-items-center mt-5'>
                        <div
                            className='text-primary fw-bold'>
                            <Spinner size={30}  />
                        </div>
                        <div
                            className='text-dark fw-bold'
                            style={{ fontSize: 'calc(1rem + 1.5vw)' }}>
                            Please wait a moment
                        </div>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default LoadingWrapper;
