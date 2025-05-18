<?php include '../../includes/header.php'; ?>

<div class="app-container">
    <!-- Section Filtres -->
    <section class="filters-section">
        <form method="get">
            <div class="subdivision-selector">
                <label for="subdivision"><i class="fas fa-map-marked-alt"></i> Daïra :</label>
                <select id="subdivision" name="daira" class="form-control">
                    <option value="">Toutes les daïras</option>
                    <?php foreach ($dairas as $daira): ?>
                        <option value="<?= $daira['id'] ?>" <?= ($daira['id'] == ($_GET['daira'] ?? '')) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($daira['nom']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="project-type">
                <label for="type"><i class="fas fa-project-diagram"></i> Type :</label>
                <select id="type" name="type" class="form-control">
                    <option value="">Tous les types</option>
                    <option value="puits_profond" <?= ('puits_profond' == ($_GET['type'] ?? '')) ? 'selected' : '' ?>>Puits profond</option>
                    <option value="forage" <?= ('forage' == ($_GET['type'] ?? '')) ? 'selected' : '' ?>>Forage</option>
                    <option value="reseau" <?= ('reseau' == ($_GET['type'] ?? '')) ? 'selected' : '' ?>>Réseau</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">
                <i class="fas fa-filter"></i> Filtrer
            </button>
        </form>
    </section>
    
    <!-- Cartes de statistiques -->
    <div class="stats-cards">
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-solar-panel"></i>
            </div>
            <div class="stat-content">
                <h3>Projets achevés</h3>
                <p class="stat-value"><?= $stats['projets_acheves'] ?></p>
                <p class="stat-info">+15% vs 2023</p>
            </div>
        </div>
        
        <!-- Répétez pour les autres cartes avec $stats['projets_en_cours'], etc. -->
    </div>

    <!-- Tableau des projets -->
    <section class="projects-section">
        <table class="projects-table">
            <thead>
                <tr>
                    <th>N° Projet</th>
                    <th>Intitulé</th>
                    <th>Localité</th>
                    <th>Type</th>
                    <th>Budget (DA)</th>
                    <th>Avancement</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($projets as $projet): ?>
                <tr>
                    <td><?= htmlspecialchars($projet['code_projet']) ?></td>
                    <td><?= htmlspecialchars($projet['titre']) ?></td>
                    <td><?= htmlspecialchars($projet['daira_nom']) ?></td>
                    <td><?= ucfirst(str_replace('_', ' ', $projet['type_installation'])) ?></td>
                    <td><?= number_format($projet['budget'], 0, ',', ' ') ?></td>
                    <td>
                        <div class="progress-container">
                            <div class="progress-bar" style="width:<?= $projet['progression'] ?>%"></div>
                            <span><?= $projet['progression'] ?>%</span>
                        </div>
                    </td>
                    <td>
                        <a href="/electrification/details?id=<?= $projet['id'] ?>" class="btn-view">Voir</a>
                        <a href="/electrification/modifier?id=<?= $projet['id'] ?>" class="btn-edit">Modifier</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </section>
</div>

<?php include '../../includes/footer.php'; ?>