package com.example.config;

import org.apache.catalina.LifecycleListener;
import org.apache.catalina.core.AprLifecycleListener;
import org.apache.coyote.http11.Http11AprProtocol;
import org.apache.coyote.http2.Http2Protocol;
import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.Ssl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@ConditionalOnProperty(name = "server.tomcat.apr.enabled", havingValue = "true")
public class TomcatAprConfig {

    // properties

    @Value("${server.ssl.enabled:#{true}}")
    private Boolean sslEnabled;

    @Value("${server.http2.enabled:#{false}}")
    private Boolean http2Enabled;

    @Value("${server.ssl.key-store-type:#{null}}")
    private String keyStoreType;

    @Value("${server.ssl.key-store:#{null}}")
    private String keyStorePath;

    @Value("${server.ssl.key-store-password:#{null}}")
    private String keyStorePassword;

    @Value("${server.ssl.key-alias:#{null}}")
    private String keyAlias;

    @Value("${server.ssl.public-certificate:#{null}}")
    private String publicCertificatePath;

    @Value("${server.ssl.private-key:#{null}}")
    private String privateKeyPath;

    @Value("${server.compression.enabled:#{false}}")
    private Boolean compressionEnabled;

    @Value("${server.compression.min-response-size:#{2048}}")
    private Integer compressionMinSize;

    @Value("${server.compression.mime-types:text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json,application/xml}")
    private String compressionMimeTypes;

    // public methods

    @Bean(name = "tomcatServletWebServerFactory")
    public TomcatServletWebServerFactory createServerFactory(ServerProperties serverProperties, ResourceLoader resourceLoader) {
        // This configuration is used to improve client connection performance by using native libraries.
        if (this.keyStoreType != null || this.keyStorePath != null || this.keyStorePassword != null || this.keyAlias != null) {
            throw new RuntimeException("Tomcat APR configuration can not be uses with server.ssl.key-store-type, server.ssl.key-store, server.ssl.key-store-password and server.ssl.key-alias properties (Use server.ssl.public-certificate and server.ssl.private-key properties with PEM format)");
        }
        TomcatServletWebServerFactory serverFactory = new TomcatServletWebServerFactory() {
            @Override
            public Ssl getSsl() {
                return null;  // null returned to stop the default SSL customizer
            }
        };
        serverFactory.setProtocol("org.apache.coyote.http11.Http11AprProtocol");  // the protocol that will enable APR
        serverFactory.setContextLifecycleListeners(this.createLifecycleListeners());
        serverFactory.setTomcatConnectorCustomizers(this.createConnectorCustomizers(serverProperties, resourceLoader));
        return serverFactory;
    }

    // private methods

    private List<AprLifecycleListener> createLifecycleListeners() {
        AprLifecycleListener lifecycleListener = new AprLifecycleListener();
        return Collections.singletonList(lifecycleListener);
    }

    private List<TomcatConnectorCustomizer> createConnectorCustomizers(ServerProperties serverProperties, ResourceLoader resourceLoader) {
        TomcatConnectorCustomizer connectorCustomizer = tomcatConnector -> {
            Http11AprProtocol aprProtocol = (Http11AprProtocol) tomcatConnector.getProtocolHandler();
            // we are able to force to disable even server.ssl.* properties are defined
            if (this.sslEnabled) {
                if (this.publicCertificatePath == null) {
                    throw new RuntimeException("Public certificate path is not configured.");
                }
                if (this.privateKeyPath == null) {
                    throw new RuntimeException("Private key  path is not configured.");
                }
                Ssl connectionSsl = serverProperties.getSsl();
                String[] connectionCiphers = connectionSsl.getCiphers();
                String[] connectionProtocols = connectionSsl.getEnabledProtocols();
                tomcatConnector.setSecure(true);
                tomcatConnector.setScheme("https");
                aprProtocol.setSSLEnabled(true);
                if (connectionProtocols != null && connectionProtocols.length > 0) {
                    aprProtocol.setSslEnabledProtocols(this.joinStrings(connectionProtocols));
                }
                if (connectionCiphers != null && connectionCiphers.length > 0) {
                    aprProtocol.setCiphers(this.joinStrings(connectionCiphers));
                }
                try {
                    aprProtocol.setSSLCertificateFile(this.resolvePath(resourceLoader, this.publicCertificatePath));
                    aprProtocol.setSSLCertificateKeyFile(this.resolvePath(resourceLoader, this.privateKeyPath));
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
                if (this.compressionEnabled) {
                    if (this.http2Enabled) {
                        Http2Protocol http2Protocol = new Http2Protocol();
                        http2Protocol.setCompression("on");
                        http2Protocol.setCompressibleMimeType(this.compressionMimeTypes);
                        http2Protocol.setCompressionMinSize(this.compressionMinSize);
                        tomcatConnector.addUpgradeProtocol(http2Protocol);
                    } else {
                        aprProtocol.setCompression("on");
                        aprProtocol.setCompressibleMimeType(this.compressionMimeTypes);
                        aprProtocol.setCompressionMinSize(this.compressionMinSize);
                    }
                } else {
                    if (this.http2Enabled) {
                        tomcatConnector.addUpgradeProtocol(new Http2Protocol());
                    }
                }
            } else {
                tomcatConnector.setSecure(false);
                tomcatConnector.setScheme("http");
                aprProtocol.setSSLEnabled(false);
                if (this.compressionEnabled) {
                    aprProtocol.setCompression("on");
                    aprProtocol.setCompressibleMimeType(this.compressionMimeTypes);
                    aprProtocol.setCompressionMinSize(this.compressionMinSize);
                }
            }
        };
        return Collections.singletonList(connectorCustomizer);
    }

    private String joinStrings(String[] strings) {
        List<String> list = Arrays.asList(strings);
        return StringUtils.join(list, ',');
    }

    private String resolvePath(ResourceLoader loader, String path) throws IOException {
        Resource resource = loader.getResource(path);
        try {
            File file = resource.getFile();
            return file.getAbsolutePath();
        } catch (Exception ex) {
            throw new IOException("Absolute '" + path + "' path resolving error.", ex);
        }
    }
}