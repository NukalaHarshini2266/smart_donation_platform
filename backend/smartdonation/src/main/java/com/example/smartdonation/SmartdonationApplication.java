package com.example.smartdonation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartdonationApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartdonationApplication.class, args);
	}

}
