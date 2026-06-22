$(document).ready(function () {
	/* Mostrar ocultar area de notificaciones */
	$('.btn-Notification').on('click', function (e) {
		e.preventDefault();
		var ContainerNoty = $('.container-notifications');
		var NotificationArea = $('.NotificationArea');
		if (NotificationArea.hasClass('NotificationArea-show') && ContainerNoty.hasClass('container-notifications-show')) {
			NotificationArea.removeClass('NotificationArea-show');
			ContainerNoty.removeClass('container-notifications-show');
		} else {
			NotificationArea.addClass('NotificationArea-show');
			ContainerNoty.addClass('container-notifications-show');
		}
	});

	/* Mostrar ocultar menu principal */
	$('.btn-menu').on('click', function (e) {
		e.preventDefault();
		var navLateral = $('.navLateral');
		var pageContent = $('.pageContent');
		var navOption = $('.navBar-options');
		if (navLateral.hasClass('navLateral-change') && pageContent.hasClass('pageContent-change')) {
			navLateral.removeClass('navLateral-change');
			pageContent.removeClass('pageContent-change');
			navOption.removeClass('navBar-options-change');
		} else {
			navLateral.addClass('navLateral-change');
			pageContent.addClass('pageContent-change');
			navOption.addClass('navBar-options-change');
		}
	});

	/* Salir del sistema (Actualizado a SweetAlert 2) */
	$('.btn-exit').on('click', function (e) {
		e.preventDefault();
		Swal.fire({
			title: '¿Deseas salir del sistema?',
			text: "La sesión actual se cerrará por seguridad.",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, salir',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				// Borrar datos de sesión
				sessionStorage.removeItem('usuarioLogueado');
				localStorage.removeItem('userSession');
				window.location.href = 'index.html';
			}
		});
	});

	/* Mostrar y ocultar submenus */
	$('.btn-subMenu').on('click', function (e) {
		e.preventDefault();
		var subMenu = $(this).next('ul');
		var icon = $(this).children("span");

		if (subMenu.hasClass('sub-menu-options-show')) {
			subMenu.removeClass('sub-menu-options-show');
			icon.addClass('zmdi-chevron-left').removeClass('zmdi-chevron-down');
			$(this).removeClass('active');
		} else {
			subMenu.addClass('sub-menu-options-show');
			icon.addClass('zmdi-chevron-down').removeClass('zmdi-chevron-left');
			$(this).addClass('active');
		}
	});
});

/* Inicializar Scrollbars personalizados */
(function ($) {
	$(window).on("load", function () {
		$(".NotificationArea, .pageContent").mCustomScrollbar({
			theme: "dark-thin",
			scrollbarPosition: "inside",
			autoHideScrollbar: true,
			scrollButtons: { enable: true }
		});
		$(".navLateral-body").mCustomScrollbar({
			theme: "light-thin",
			scrollbarPosition: "inside",
			autoHideScrollbar: true,
			scrollButtons: { enable: true }
		});
	});
})(jQuery);