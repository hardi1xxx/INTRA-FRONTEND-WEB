import { Box, Typography } from "@mui/material"

// page for forbidden access page
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
			<Typography variant="h1" fontSize={'6rem'}>403</Typography>
			<Typography variant="h1">Access Forbidden</Typography>
		</Box>
	)
}

export default NotFoundPage