// src/main/java/com/simvex/simvex_api/model/ModelRepository.java
package com.simvex.simvex_api.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModelRepository extends JpaRepository<ModelEntity, Long> {
    Optional<ModelEntity> findByTitle(String title);
}
