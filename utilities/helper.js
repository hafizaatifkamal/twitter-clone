const constant = require("./constant");

const customResponse = ({
	code = 200,
	status,
	message = "",
	data = {},
	err = {},
	totalResult,
	totalCount,
	totalPage,
}) => {
	const responseStatus = status
		? status
		: code < 300
			? constant.STATUS_SUCCESS
			: constant.STATUS_FAILURE;
	return {
		status: responseStatus,
		code,
		totalResult,
		totalCount,
		data,
		message,
		error: err,
		totalPage,
	};
};

module.exports = customResponse;