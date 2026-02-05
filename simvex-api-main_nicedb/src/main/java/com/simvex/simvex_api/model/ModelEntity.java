// src/main/java/com/simvex/simvex_api/model/ModelEntity.java
package com.simvex.simvex_api.model;

import com.simvex.simvex_api.part.PartEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "models")
public class ModelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "model_url", nullable = false)
    private String modelUrl;

    @OneToMany(mappedBy = "model", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PartEntity> parts = new ArrayList<>();

    // JPA 기본 생성자
    protected ModelEntity() {}

    public ModelEntity(String title, String modelUrl) {
        this.title = title;
        this.modelUrl = modelUrl;
    }

    // ===== getters =====
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getModelUrl() { return modelUrl; }
    public List<PartEntity> getParts() { return parts; }

    // ===== setters =====
    public void setTitle(String title) { this.title = title; }
    public void setModelUrl(String modelUrl) { this.modelUrl = modelUrl; }

    // ===== convenience =====
    public void addPart(PartEntity part) {
        if (part == null) return;
        parts.add(part);
        part.setModel(this);
    }

    public void removePart(PartEntity part) {
        if (part == null) return;
        parts.remove(part);
        part.setModel(null);
    }
}
