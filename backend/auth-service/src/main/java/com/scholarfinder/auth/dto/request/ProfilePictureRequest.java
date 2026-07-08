package com.scholarfinder.auth.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilePictureRequest {

    @Size(max = 1500000, message = "Profile picture must be smaller than 1 MB")
    private String profilePictureUrl;
}
