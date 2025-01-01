import React from 'react';
import '../styles/ErrorPage.css'; // Import the CSS file

const ErrorPage = ({ statusCode }) => {
    return (
        <div className="error-container">
            <h1 className="error-code">{statusCode}</h1>
            <h2 className="error-message">
                {statusCode === 404 ? 'Page Not Found' : 'An Error Occurred'}
            </h2>
            <p className="error-description">
                {statusCode === 404
                    ? 'The page you are looking for does not exist.'
                    : 'Something went wrong. Please try again later.'}
            </p>
            <a href="/" className="error-link">Return</a>
        </div>
    );
};

export default ErrorPage;
