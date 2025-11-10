package com.tempcloud.cloudfilesharing;

import com.tempcloud.cloudfilesharing.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(FileStorageProperties.class)
public class CloudFileSharingApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloudFileSharingApplication.class, args);
    }
}
