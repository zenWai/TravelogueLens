function FormatDate(date) {
    const dateObject = new Date(date);

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    // Convert the date object to the desired format using Intl.DateTimeFormat
    return new Intl.DateTimeFormat('en-US', options).format(dateObject);
}

export default FormatDate;