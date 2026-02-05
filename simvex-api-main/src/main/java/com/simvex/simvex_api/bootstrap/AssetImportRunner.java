// src/main/java/com/simvex/simvex_api/bootstrap/AssetImportRunner.java
package com.simvex.simvex_api.bootstrap;

import com.simvex.simvex_api.model.AssetImportService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AssetImportRunner implements CommandLineRunner {

    private final AssetImportService assetImportService;

    public AssetImportRunner(AssetImportService assetImportService) {
        this.assetImportService = assetImportService;
    }

    @Override
    public void run(String... args) {
        try {
            System.out.println("[IMPORT] AssetImportRunner 시작");
            assetImportService.importAllFromResources();
            System.out.println("[IMPORT] AssetImportRunner 종료");
        } catch (Exception e) {
            System.out.println("[IMPORT] 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
