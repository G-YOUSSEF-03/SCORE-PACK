<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'youssef.admin@scorepack.ma'],
            [
                'name' => 'Youssef Admin',
                'phone' => '+212 6 12 34 56 78',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        Setting::updateOrCreate(
            ['id' => 1],
            [
                'company_name' => 'SCORE PACK',
                'tagline' => 'Bureau d’études des projets d’investissement',
                'email' => 'youssefelgourari1@gmail.com',
                'phone' => '+212 6 12 34 56 78',
                'secondary_phone' => '+212 5 22 98 76 54',
                'address' => 'RUE SARIA BEN ZOUNAIM ETG 3 APPT 3, PALMIER, CASABLANCA, MOROCCO',
                'city' => 'Casablanca',
                'country' => 'Maroc',
                'working_hours' => 'Lundi - Vendredi : 08h30 - 18h30 / Samedi : 09h00 - 13h00',
            ]
        );

        collect([
            ['title' => 'Études de faisabilité', 'description' => 'Nous analysons la viabilité de votre projet sous tous ses aspects techniques, économiques, financiers et juridiques.', 'icon' => 'bar-chart-3', 'status' => 'active', 'order' => 1],
            ['title' => 'Études techniques', 'description' => 'Conception technique détaillée, dimensionnement et choix technologiques adaptés à votre projet.', 'icon' => 'settings', 'status' => 'active', 'order' => 2],
            ['title' => 'Études financières', 'description' => 'Prévisions financières, analyses de rentabilité et plans de financement sur mesure.', 'icon' => 'pie-chart', 'status' => 'active', 'order' => 3],
            ['title' => 'Montage de dossiers', 'description' => 'Constitution de dossiers solides et complets pour banques, investisseurs et organismes de financement.', 'icon' => 'folder', 'status' => 'active', 'order' => 4],
            ['title' => 'Accompagnement', 'description' => "Nous vous accompagnons à chaque étape de votre projet jusqu'à sa concrétisation.", 'icon' => 'handshake', 'status' => 'active', 'order' => 5],
            ['title' => 'Conseil stratégique', 'description' => 'Conseils personnalisés pour optimiser vos décisions et maximiser la performance de vos investissements.', 'icon' => 'clipboard-list', 'status' => 'active', 'order' => 6],
        ])->each(fn(array $service) => Service::updateOrCreate(['title' => $service['title']], $service));

        collect($this->serviceDetails())->each(fn(array $service) => Service::updateOrCreate(['order' => $service['order']], $service));

        collect([
            ['title' => 'Complexe résidentiel à Casablanca', 'category' => 'Immobilier', 'location' => 'Casablanca', 'short_description' => 'Étude de faisabilité et montage financier pour un complexe résidentiel.', 'detailed_description' => 'Étude de faisabilité et montage financier pour un complexe résidentiel.', 'client' => 'Client SCORE PACK', 'project_date' => now()->subMonths(2)->toDateString(), 'estimated_budget' => '15 000 000 MAD', 'duration' => '24 mois', 'slug' => 'complexe-residentiel-casablanca', 'meta_title' => 'Complexe résidentiel à Casablanca | SCORE PACK', 'meta_description' => 'Découvrez notre projet de complexe résidentiel à Casablanca.', 'status' => 'published', 'is_published' => true],
            ['title' => 'Unité de production industrielle', 'category' => 'Industrie', 'location' => 'Tanger', 'short_description' => 'Étude technique et financière pour une unité de production.', 'detailed_description' => 'Étude technique et financière pour une unité de production.', 'client' => 'Client SCORE PACK', 'project_date' => now()->subMonths(3)->toDateString(), 'estimated_budget' => '22 000 000 MAD', 'duration' => '18 mois', 'slug' => 'unite-production-industrielle', 'meta_title' => 'Unité de production industrielle | SCORE PACK', 'meta_description' => 'Découvrez notre projet industriel à Tanger.', 'status' => 'published', 'is_published' => true],
            ['title' => 'Centrale solaire à Ouarzazate', 'category' => 'Énergie', 'location' => 'Ouarzazate', 'short_description' => 'Analyse de rentabilité et structuration du financement.', 'detailed_description' => 'Analyse de rentabilité et structuration du financement.', 'client' => 'Client SCORE PACK', 'project_date' => now()->subMonths(4)->toDateString(), 'estimated_budget' => '30 000 000 MAD', 'duration' => '30 mois', 'slug' => 'centrale-solaire-ouarzazate', 'meta_title' => 'Centrale solaire à Ouarzazate | SCORE PACK', 'meta_description' => 'Découvrez notre projet solaire à Ouarzazate.', 'status' => 'published', 'is_published' => true],
            ['title' => 'Aménagement routier à Marrakech', 'category' => 'Infrastructure', 'location' => 'Marrakech', 'short_description' => 'Étude budgétaire et montage du dossier technique.', 'detailed_description' => 'Étude budgétaire et montage du dossier technique.', 'client' => 'Client SCORE PACK', 'project_date' => now()->subMonths(5)->toDateString(), 'estimated_budget' => '10 000 000 MAD', 'duration' => '12 mois', 'slug' => 'amenagement-routier-marrakech', 'meta_title' => 'Aménagement routier à Marrakech | SCORE PACK', 'meta_description' => 'Découvrez notre projet infrastructure à Marrakech.', 'status' => 'draft', 'is_published' => false],
        ])->each(fn(array $project) => Project::updateOrCreate(['title' => $project['title']], $project));

        collect([
            [
                'title' => 'Analyse du marché immobilier au Maroc en 2024',
                'slug' => 'analyse-du-marche-immobilier-au-maroc-en-2024',
                'excerpt' => 'Un regard sur les tendances, les zones porteuses et les criteres qui influencent la rentabilite des projets immobiliers.',
                'content' => 'Le marche immobilier marocain continue de se transformer sous l effet de la demande urbaine, des nouveaux besoins residentiels et de la recherche de projets mieux structures. Une analyse precise du foncier, du positionnement commercial et du financement reste essentielle avant tout investissement.',
                'category' => 'Immobilier',
                'status' => 'published',
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => 'L’industrie marocaine : un moteur de croissance durable',
                'slug' => 'industrie-marocaine-moteur-croissance-durable',
                'excerpt' => 'Les secteurs industriels gagnent en maturite grace aux ecosystemes, a la logistique et aux investissements productifs.',
                'content' => 'L industrie marocaine offre de nouvelles opportunites aux porteurs de projets, notamment dans l automobile, l agro-industrie, la logistique et la transformation. Une etude technique et financiere aide a mesurer les besoins d equipement, les couts et les perspectives de croissance.',
                'category' => 'Industrie',
                'status' => 'published',
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => 'Étude de faisabilité : les étapes clés pour réussir votre projet',
                'slug' => 'etude-de-faisabilite-etapes-cles-reussir-projet',
                'excerpt' => 'De l idee initiale au plan de financement, chaque etape permet de reduire les risques et de clarifier la decision.',
                'content' => 'Une etude de faisabilite efficace commence par l analyse du marche, se poursuit par l evaluation technique, puis se concretise avec les hypotheses financieres. Elle permet aux investisseurs de comprendre les risques, les marges et les conditions de succes du projet.',
                'category' => 'Conseil',
                'status' => 'published',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Énergies renouvelables : quelles opportunités au Maroc ?',
                'slug' => 'energies-renouvelables-opportunites-maroc',
                'excerpt' => 'Le solaire, l efficacite energetique et les projets hybrides ouvrent de nouvelles perspectives aux investisseurs.',
                'content' => 'Le Maroc dispose d atouts importants pour les projets d energies renouvelables. L evaluation du site, du raccordement, du rendement et du modele economique permet de construire des projets solides et finançables.',
                'category' => 'Energie',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
        ])->each(fn(array $article) => News::updateOrCreate(['slug' => $article['slug']], $article));
    }

    private function serviceDetails(): array
    {
        return [
            [
                'title' => 'Études de faisabilité',
                'slug' => 'etudes-faisabilite',
                'description' => 'Nous analysons la viabilité de votre projet sous tous ses aspects techniques, économiques, financiers et juridiques.',
                'icon' => 'bar-chart-3',
                'status' => 'active',
                'order' => 1,
                'short_description' => 'Étude multidisciplinaire pour valider la viabilité de votre projet.',
                'full_description' => 'Nous analysons la viabilité de votre projet sous tous ses aspects techniques, économiques, financiers et juridiques pour vous aider à prendre les meilleures décisions.',
                'advantages' => [
                    ['title' => 'Analyse complète', 'description' => 'Étude multidisciplinaire'],
                    ['title' => 'Décisions éclairées', 'description' => 'Données fiables'],
                    ['title' => 'Réduction des risques', 'description' => 'Anticipez les obstacles'],
                    ['title' => 'Gain de temps', 'description' => 'Processus optimisé'],
                ],
                'process_steps' => [
                    ['title' => 'Analyse préliminaire', 'description' => 'Nous recueillons et analysons les informations clés sur votre projet et son environnement.'],
                    ['title' => 'Étude de marché', 'description' => 'Nous évaluons le marché, la demande, la concurrence et les opportunités.'],
                    ['title' => 'Étude technique', 'description' => 'Nous définissons les solutions techniques adaptées et évaluons les besoins.'],
                    ['title' => 'Étude financière', 'description' => 'Nous estimons les coûts, les revenus et la rentabilité prévisionnelle.'],
                    ['title' => 'Étude juridique', 'description' => 'Nous analysons les aspects juridiques et réglementaires applicables.'],
                    ['title' => 'Rapport final', 'description' => 'Nous vous remettons un rapport complet avec nos conclusions et recommandations.'],
                ],
                'deliverables' => ['Rapport d’étude de faisabilité complet', 'Analyse des risques et recommandations', 'Scénarios financiers et projections', 'Plan d’action et prochaines étapes'],
                'cta_title' => 'Vous avez un projet ?',
                'cta_description' => 'Contactez-nous pour une étude de faisabilité personnalisée et des conseils adaptés.',
            ],
            [
                'title' => 'Études techniques',
                'slug' => 'etudes-techniques',
                'description' => 'Conception technique détaillée, dimensionnement et choix technologiques adaptés à votre projet.',
                'icon' => 'settings',
                'status' => 'active',
                'order' => 2,
                'short_description' => 'Solutions techniques fiables pour structurer et dimensionner votre projet.',
                'full_description' => 'Nous concevons les bases techniques de votre projet avec une analyse rigoureuse des contraintes, des besoins, des normes et des solutions les plus adaptées à vos objectifs.',
                'advantages' => [
                    ['title' => 'Solutions adaptées', 'description' => 'Choix techniques pertinents'],
                    ['title' => 'Conformité', 'description' => 'Respect des normes'],
                    ['title' => 'Maîtrise des coûts', 'description' => 'Dimensionnement optimisé'],
                    ['title' => 'Vision claire', 'description' => 'Besoins bien définis'],
                ],
                'process_steps' => [
                    ['title' => 'Diagnostic technique', 'description' => 'Nous analysons les contraintes et les besoins du projet.'],
                    ['title' => 'Dimensionnement', 'description' => 'Nous évaluons les capacités, équipements et ressources nécessaires.'],
                    ['title' => 'Choix des solutions', 'description' => 'Nous comparons les options techniques et technologiques.'],
                    ['title' => 'Estimation budgétaire', 'description' => 'Nous relions les choix techniques aux coûts prévisionnels.'],
                    ['title' => 'Validation normative', 'description' => 'Nous vérifions la cohérence avec les exigences applicables.'],
                    ['title' => 'Dossier technique', 'description' => 'Nous structurons un dossier clair pour décision et exécution.'],
                ],
                'deliverables' => ['Note technique détaillée', 'Dimensionnement des besoins', 'Cahier des charges', 'Estimation des coûts', 'Recommandations techniques', 'Dossier de synthèse'],
                'cta_title' => 'Besoin d’une étude technique ?',
                'cta_description' => 'Contactez-nous pour construire une base technique solide et exploitable.',
            ],
            [
                'title' => 'Études financières',
                'slug' => 'etudes-financieres',
                'description' => 'Prévisions financières, analyses de rentabilité et plans de financement sur mesure.',
                'icon' => 'pie-chart',
                'status' => 'active',
                'order' => 3,
                'short_description' => 'Modèles financiers et projections pour mesurer la rentabilité.',
                'full_description' => 'Nous construisons des projections financières fiables pour évaluer l’investissement, la rentabilité, les besoins de financement et les scénarios possibles de votre projet.',
                'advantages' => [
                    ['title' => 'Rentabilité mesurée', 'description' => 'Indicateurs financiers'],
                    ['title' => 'Prévisions fiables', 'description' => 'Hypothèses structurées'],
                    ['title' => 'Financement clair', 'description' => 'Besoins identifiés'],
                    ['title' => 'Décision sécurisée', 'description' => 'Scénarios comparés'],
                ],
                'process_steps' => [
                    ['title' => 'Collecte des données', 'description' => 'Nous rassemblons les hypothèses commerciales, techniques et budgétaires.'],
                    ['title' => 'Budget d’investissement', 'description' => 'Nous estimons les dépenses initiales et les coûts de lancement.'],
                    ['title' => 'Prévisions d’exploitation', 'description' => 'Nous projetons les revenus, charges et flux financiers.'],
                    ['title' => 'Analyse de rentabilité', 'description' => 'Nous calculons les indicateurs clés de performance financière.'],
                    ['title' => 'Plan de financement', 'description' => 'Nous structurons les sources et besoins de financement.'],
                    ['title' => 'Rapport financier', 'description' => 'Nous remettons un dossier exploitable pour partenaires et décideurs.'],
                ],
                'deliverables' => ['Prévisionnel financier', 'Plan de financement', 'Analyse de rentabilité', 'Tableaux de trésorerie', 'Scénarios financiers', 'Synthèse investisseurs'],
                'cta_title' => 'Vous souhaitez mesurer la rentabilité ?',
                'cta_description' => 'Contactez-nous pour une étude financière structurée et adaptée.',
            ],
            [
                'title' => 'Montage de dossiers',
                'slug' => 'montage-dossiers',
                'description' => 'Constitution de dossiers solides et complets pour banques, investisseurs et organismes de financement.',
                'icon' => 'folder',
                'status' => 'active',
                'order' => 4,
                'short_description' => 'Dossiers clairs et convaincants pour financeurs et partenaires.',
                'full_description' => 'Nous préparons des dossiers complets, cohérents et professionnels pour présenter votre projet aux banques, investisseurs, administrations et organismes de financement.',
                'advantages' => [
                    ['title' => 'Dossier complet', 'description' => 'Pièces structurées'],
                    ['title' => 'Présentation claire', 'description' => 'Lecture facilitée'],
                    ['title' => 'Crédibilité renforcée', 'description' => 'Argumentaire solide'],
                    ['title' => 'Suivi efficace', 'description' => 'Processus accompagné'],
                ],
                'process_steps' => [
                    ['title' => 'Analyse du besoin', 'description' => 'Nous identifions le type de dossier et les destinataires.'],
                    ['title' => 'Collecte des pièces', 'description' => 'Nous organisons les documents et informations nécessaires.'],
                    ['title' => 'Structuration', 'description' => 'Nous construisons une présentation claire et cohérente.'],
                    ['title' => 'Rédaction', 'description' => 'Nous préparons les contenus, synthèses et arguments clés.'],
                    ['title' => 'Vérification', 'description' => 'Nous contrôlons la complétude et la qualité du dossier.'],
                    ['title' => 'Remise finale', 'description' => 'Nous livrons un dossier prêt à être présenté.'],
                ],
                'deliverables' => ['Dossier d’investissement', 'Synthèse exécutive', 'Argumentaire projet', 'Pièces organisées', 'Présentation partenaires', 'Plan de suivi'],
                'cta_title' => 'Préparer votre dossier ?',
                'cta_description' => 'Contactez-nous pour constituer un dossier professionnel et complet.',
            ],
            [
                'title' => 'Accompagnement',
                'slug' => 'accompagnement',
                'description' => "Nous vous accompagnons à chaque étape de votre projet jusqu'à sa concrétisation.",
                'icon' => 'handshake',
                'status' => 'active',
                'order' => 5,
                'short_description' => 'Un accompagnement continu de l’idée à la concrétisation.',
                'full_description' => 'Nous accompagnons les porteurs de projets dans les décisions, arbitrages, démarches et étapes clés afin de transformer une idée en projet structuré et réalisable.',
                'advantages' => [
                    ['title' => 'Suivi personnalisé', 'description' => 'Conseils adaptés'],
                    ['title' => 'Vision globale', 'description' => 'Projet mieux piloté'],
                    ['title' => 'Aide à la décision', 'description' => 'Arbitrages éclairés'],
                    ['title' => 'Gain d’efficacité', 'description' => 'Étapes coordonnées'],
                ],
                'process_steps' => [
                    ['title' => 'Cadrage du projet', 'description' => 'Nous clarifions vos objectifs et priorités.'],
                    ['title' => 'Plan d’accompagnement', 'description' => 'Nous définissons les étapes, livrables et responsabilités.'],
                    ['title' => 'Suivi opérationnel', 'description' => 'Nous vous assistons dans l’avancement du projet.'],
                    ['title' => 'Coordination', 'description' => 'Nous facilitons les échanges avec partenaires et intervenants.'],
                    ['title' => 'Ajustements', 'description' => 'Nous adaptons l’approche selon les contraintes rencontrées.'],
                    ['title' => 'Bilan final', 'description' => 'Nous synthétisons les résultats et prochaines actions.'],
                ],
                'deliverables' => ['Plan d’accompagnement', 'Tableau de suivi', 'Comptes rendus', 'Recommandations', 'Coordination partenaires', 'Bilan de projet'],
                'cta_title' => 'Besoin d’être accompagné ?',
                'cta_description' => 'Contactez-nous pour un accompagnement personnalisé à chaque étape.',
            ],
            [
                'title' => 'Conseil stratégique',
                'slug' => 'conseil-strategique',
                'description' => 'Conseils personnalisés pour optimiser vos décisions et maximiser la performance de vos investissements.',
                'icon' => 'clipboard-list',
                'status' => 'active',
                'order' => 6,
                'short_description' => 'Des décisions plus solides grâce à une vision stratégique claire.',
                'full_description' => 'Nous apportons un regard stratégique sur vos projets d’investissement afin d’identifier les priorités, les risques, les opportunités et les leviers de performance.',
                'advantages' => [
                    ['title' => 'Vision stratégique', 'description' => 'Priorités clarifiées'],
                    ['title' => 'Décisions optimisées', 'description' => 'Choix mieux orientés'],
                    ['title' => 'Performance accrue', 'description' => 'Leviers identifiés'],
                    ['title' => 'Risques maîtrisés', 'description' => 'Anticipation renforcée'],
                ],
                'process_steps' => [
                    ['title' => 'Diagnostic stratégique', 'description' => 'Nous analysons votre contexte, vos objectifs et vos contraintes.'],
                    ['title' => 'Analyse des options', 'description' => 'Nous comparons les scénarios possibles.'],
                    ['title' => 'Évaluation des risques', 'description' => 'Nous identifions les points sensibles et mesures d’atténuation.'],
                    ['title' => 'Plan d’action', 'description' => 'Nous définissons les priorités et étapes concrètes.'],
                    ['title' => 'Recommandations', 'description' => 'Nous formulons des recommandations claires et actionnables.'],
                    ['title' => 'Suivi stratégique', 'description' => 'Nous accompagnons la mise en œuvre des décisions clés.'],
                ],
                'deliverables' => ['Diagnostic stratégique', 'Analyse des scénarios', 'Plan d’action', 'Matrice des risques', 'Recommandations', 'Synthèse décisionnelle'],
                'cta_title' => 'Besoin d’un avis stratégique ?',
                'cta_description' => 'Contactez-nous pour prendre les bonnes décisions avec une vision claire.',
            ],
        ];
    }
}
