// src/main/java/com/simvex/simvex_api/bootstrap/AssetImportRunner.java
package com.simvex.simvex_api.bootstrap;

import com.simvex.simvex_api.model.ModelEntity;
import com.simvex.simvex_api.model.ModelRepository;
import com.simvex.simvex_api.part.PartEntity;
import com.simvex.simvex_api.part.PartRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

@Component
@ConditionalOnProperty(prefix = "simvex.assets.import", name = "enabled", havingValue = "true")
public class AssetImportRunner implements CommandLineRunner {

    private final ModelRepository modelRepository;
    private final PartRepository partRepository;

    @org.springframework.beans.factory.annotation.Value("${simvex.assets.import.root}")
    private String importRoot;

    public AssetImportRunner(
            ModelRepository modelRepository,
            PartRepository partRepository
    ) {
        this.modelRepository = modelRepository;
        this.partRepository = partRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Path root = Paths.get(importRoot).normalize();
        if (!Files.exists(root) || !Files.isDirectory(root)) {
            System.out.println("[AssetImportRunner] import root not found: " + root);
            return;
        }

        System.out.println("[AssetImportRunner] scanning: " + root);

        try (DirectoryStream<Path> modelDirs = Files.newDirectoryStream(root)) {
            for (Path modelDir : modelDirs) {
                if (!Files.isDirectory(modelDir)) continue;

                String modelTitle = modelDir.getFileName().toString();
                ModelEntity model = upsertModel(modelTitle);

                importPartsForModel(model, modelDir);
            }
        }

        System.out.println("[AssetImportRunner] done");
    }

    private ModelEntity upsertModel(String title) {
        String modelUrl = "/assets/3d/" + encodePathSegment(title) + "/";

        ModelEntity model = modelRepository.findByTitle(title)
                .orElseGet(() -> new ModelEntity(title, modelUrl));

        model.setTitle(title);
        model.setModelUrl(modelUrl);

        ModelEntity saved = modelRepository.save(model);
        System.out.println("[AssetImportRunner] model upsert: " + saved.getId() + " " + title);
        return saved;
    }

    private void importPartsForModel(ModelEntity model, Path modelDir) throws Exception {
        List<Path> files = new ArrayList<>();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(modelDir)) {
            for (Path p : stream) {
                if (Files.isDirectory(p)) continue;
                String lower = p.getFileName().toString().toLowerCase(Locale.ROOT);
                if (lower.endsWith(".glb") || lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                    files.add(p);
                }
            }
        }

        for (Path file : files) {
            String fileName = file.getFileName().toString();
            String meshName = stripExtension(fileName);

            String type = isImage(fileName) ? "image" : "part";

            String fileUrl = "/assets/3d/"
                    + encodePathSegment(model.getTitle())
                    + "/"
                    + encodePathSegment(fileName);

            // ✅ jsonb 로 들어갈 Map 을 그대로 만든다
            Map<String, Object> content = new LinkedHashMap<>();
            content.put("name", meshName);
            content.put("type", type);
            content.put("fileUrl", fileUrl);

            if ("image".equals(type)) {
                content.put("description", "조립도/참고 이미지");
            } else {
                content.put("description", "");
                content.put("function", "");
                content.put("structure", "");
                content.put("material", "");
            }

            PartEntity part = partRepository
                    .findByModel_IdAndMeshName(model.getId(), meshName)
                    .orElseGet(() -> new PartEntity(model, meshName, content));

            // 이미 있던 Part 면 최신 값으로 업데이트
            part.setModel(model);
            part.setMeshName(meshName);
            part.setContent(content);

            partRepository.save(part);
            System.out.println("[AssetImportRunner] part upsert: " + model.getTitle() + " / " + meshName + " (" + type + ")");
        }
    }

    private boolean isImage(String fileName) {
        String lower = fileName.toLowerCase(Locale.ROOT);
        return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg");
    }

    private String stripExtension(String fileName) {
        int idx = fileName.lastIndexOf('.');
        return idx > 0 ? fileName.substring(0, idx) : fileName;
    }

    private String encodePathSegment(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8)
                .replace("+", "%20");
    }
}
