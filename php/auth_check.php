<?php
	
	if(session_status() == PHP_SESSION_NONE) {
		header('Location: auth');
	}