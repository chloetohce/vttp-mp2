package vttp.project.mp2.model;

public class LoginResponse {
    private String token;

    private long expiresIn;

    private String refreshToken;

    public String getToken() {return token;}
    public void setToken(String token) {this.token = token;}

    public long getExpiresIn() {return expiresIn;}
    public void setExpiresIn(long expiresIn) {this.expiresIn = expiresIn;}

    public String getRefreshToken() {return refreshToken;}
    public void setRefreshToken(String refreshToken) {this.refreshToken = refreshToken;}
    
        
}
