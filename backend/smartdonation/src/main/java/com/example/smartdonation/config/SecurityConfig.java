package com.example.smartdonation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter){
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth


                        // ✅ PUBLIC APIs

                        .requestMatchers("/api/user/login").permitAll()
                        .requestMatchers("/api/user/forgot-password/**").permitAll()
                        .requestMatchers("/api/user/donor").permitAll()
                        .requestMatchers("/api/organization/register").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/organization/orgnames").permitAll()
                        .requestMatchers("/api/notifications/**").permitAll()

                        // ✅ ADMIN APIs
                        .requestMatchers("/api/organization/all").hasRole("ADMIN")
                        .requestMatchers("/api/organization/approve").hasRole("ADMIN")
                        .requestMatchers("/api/organization/pending").hasRole("ADMIN")
                        .requestMatchers("/api/organization/reject").hasRole("ADMIN")
                        .requestMatchers("/api/organization/update-checklist").hasRole("ADMIN")
                        // ✅ ANY LOGGED-IN USER
                        .anyRequest().authenticated()
                )

                // 🔥 VERY IMPORTANT
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
}