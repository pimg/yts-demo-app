package com.yolt.yts.testapp.site;


import com.yolt.yts.sdk.YTS;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
public class SiteController {

    private final YTS yts;

    public SiteController(YTS yts) {
        this.yts = yts;
    }

    @GetMapping("sites")
    public List<TestAppSite> getSites(HttpServletResponse response) {
        response.addCookie(new Cookie("bla", "bla"));
        return yts.getSites().stream()
                .map(TestAppSite::new)
                .collect(Collectors.toList());
    }

    @GetMapping("sites/{siteId}")
    public TestAppSite getSite(@PathVariable UUID siteId) {
        return new TestAppSite(yts.getSite(siteId));
    }

    @GetMapping(value = "/content/images/sites/icons/{siteId}.png", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getSiteLogo(@PathVariable UUID siteId) {
        return yts.getSiteLogo(String.format("/content/images/sites/icons/%s.png", siteId.toString()));
    }
}
