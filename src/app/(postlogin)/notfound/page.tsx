import { Box, Typography } from "@mui/material"

// page for not found page
function NotFoundPage() {
	return(
		<Box
			sx={{
				backgroundColor: 'white'
			}}
			display={'flex'}
			flexDirection={'column'}
			width={'calc(100% - 40px)'}
			p={'20px'}
			borderRadius={'8px'}
			gap={'1rem'}
			flexGrow={1}
			alignItems={'center'}
			justifyContent={'center'}
		>
			<Typography variant="h1" fontSize={'6rem'}>404</Typography>
			<Typography variant="h1">Page Not Found</Typography>
		</Box>
	)
}

export default NotFoundPage